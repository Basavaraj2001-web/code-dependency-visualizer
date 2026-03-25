import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { getGraph, getCycles } from '../services/api';
import { ArrowLeft, Search, ZoomIn, ZoomOut, Maximize, RefreshCcw, Info } from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Color constants matching CSS tokens ─── */
const COLOR = {
  nodeNormal:   '#6366f1',
  nodeCycle:    '#f85149',
  nodeSelected: '#3fb950',
  nodeHover:    '#e3b341',
  edgeNormal:   '#30363d',
  edgeCycle:    '#f85149',
  text:         '#e6edf3',
  bg:           '#161b22',
};

const GraphPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const zoomRef = useRef(null);

  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [cycleNodes, setCycleNodes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ nodes: 0, edges: 0, cycles: 0 });

  /* ─── Fetch data ─── */
  useEffect(() => {
    const load = async () => {
      try {
        const [graph, cyclesData] = await Promise.all([
          getGraph(id),
          getCycles(id).catch(() => ({ cycles: [] })),
        ]);

        // Collect all nodes that participate in a cycle
        const cycleSet = new Set();
        (cyclesData?.cycles || []).forEach((cycle) =>
          cycle.forEach((node) => cycleSet.add(node))
        );

        setGraphData(graph);
        setCycleNodes(cycleSet);
        setStats({
          nodes: graph.nodes.length,
          edges: graph.edges.length,
          cycles: (cyclesData?.cycles || []).length,
        });
      } catch (err) {
        console.error('Graph load error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ─── Build D3 graph ─── */
  useEffect(() => {
    if (loading || !graphData.nodes.length) return;

    const container = containerRef.current;
    const SVG = svgRef.current;
    if (!container || !SVG) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Clear previous render
    d3.select(SVG).selectAll('*').remove();

    const svg = d3.select(SVG)
      .attr('width', W)
      .attr('height', H);

    /* ── Zoom ── */
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);
    zoomRef.current = zoom;

    const g = svg.append('g').attr('class', 'graph-root');

    /* ── Arrow markers ── */
    const defs = svg.append('defs');

    ['normal', 'cycle'].forEach((type) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', type === 'cycle' ? COLOR.edgeCycle : COLOR.edgeNormal);
    });

    /* ── Prepare simulation data ── */
    const nodes = graphData.nodes.map((name) => ({ id: name }));
    const links = graphData.edges.map((e) => ({ source: e.source, target: e.target }));

    // Edges that are in cycles
    const cycleEdgeSet = new Set(
      links
        .filter((l) => cycleNodes.has(l.source) && cycleNodes.has(l.target))
        .map((l) => `${l.source}-${l.target}`)
    );

    /* ── Simulation ── */
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id).distance(110).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(40))
      .alphaDecay(0.025);

    simulationRef.current = simulation;

    /* ── Links ── */
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => cycleEdgeSet.has(`${d.source}-${d.target}`) ? COLOR.edgeCycle : COLOR.edgeNormal)
      .attr('stroke-width', (d) => cycleEdgeSet.has(`${d.source}-${d.target}`) ? 2 : 1)
      .attr('stroke-opacity', 0.7)
      .attr('marker-end', (d) =>
        `url(#arrow-${cycleEdgeSet.has(`${d.source}-${d.target}`) ? 'cycle' : 'normal'})`
      );

    /* ── Node groups ── */
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'graph-node')
      .style('cursor', 'pointer')
      .call(
        d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      );

    /* -- Node circles -- */
    node.append('circle')
      .attr('r', (d) => cycleNodes.has(d.id) ? 14 : 11)
      .attr('fill', (d) => cycleNodes.has(d.id) ? COLOR.nodeCycle : COLOR.nodeNormal)
      .attr('stroke', (d) => cycleNodes.has(d.id) ? '#ff7b72' : '#818cf8')
      .attr('stroke-width', 2)
      .attr('filter', (d) => cycleNodes.has(d.id) ? 'url(#glow-red)' : 'url(#glow-blue)');

    // Glow filters
    ['blue', 'red'].forEach((color) => {
      const filter = defs.append('filter').attr('id', `glow-${color}`).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
      const merge = filter.append('feMerge');
      merge.append('feMergeNode').attr('in', 'blur');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    /* -- Node labels -- */
    node.append('text')
      .text((d) => {
        // Show short name (last segment after . or /)
        const parts = d.id.split(/[./]/);
        return parts[parts.length - 1];
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '2.6em')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', '500')
      .attr('fill', COLOR.text)
      .attr('pointer-events', 'none');

    /* ── Hover & click interactions ── */
    const tooltip = d3.select('#graph-tooltip');

    node
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(150)
          .attr('r', cycleNodes.has(d.id) ? 18 : 15)
          .attr('stroke-width', 3);

        const outgoingLinks = links.filter((l) => l.source.id === d.id || l.source === d.id);
        const incomingLinks = links.filter((l) => l.target.id === d.id || l.target === d.id);
        const outgoingCount = outgoingLinks.length;
        const incomingCount = incomingLinks.length;

        let importsHtml = '';
        if (outgoingCount > 0) {
            const importsList = outgoingLinks.slice(0, 5).map(l => {
                const targetId = (l.target.id || l.target);
                const parts = targetId.split(/[./]/);
                return `<li style="font-family: var(--font-mono); font-size: 10px; margin-bottom: 2px;">${parts[parts.length - 1]}</li>`;
            }).join('');
            importsHtml = `
              <div style="margin-top: 8px; border-top: 1px solid var(--border); padding-top: 8px;">
                <strong style="font-size: 10px; color: var(--text-muted);">Imports:</strong>
                <ul style="margin: 4px 0 0 16px; padding: 0; color: var(--text-muted);">
                  ${importsList}
                </ul>
                ${outgoingCount > 5 ? `<em style="font-size: 10px; color: var(--text-muted); display: block; margin-top: 4px;">+ ${outgoingCount - 5} more</em>` : ''}
              </div>`;
        }

        tooltip
          .style('opacity', 1)
          .style('left', (event.offsetX + 16) + 'px')
          .style('top',  (event.offsetY - 10) + 'px')
          .html(`
            <div class="node-tooltip-name">${d.id}</div>
            <div class="node-tooltip-stat">
              <span>↑ Outgoing</span><strong>${outgoingCount}</strong>
            </div>
            <div class="node-tooltip-stat">
              <span>↓ Incoming</span><strong>${incomingCount}</strong>
            </div>
            ${importsHtml}
            ${cycleNodes.has(d.id) ? '<div style="margin-top:6px;color:#ffa198;font-size:11px;">⚠ In circular dependency</div>' : ''}
          `);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.offsetX + 16) + 'px')
          .style('top',  (event.offsetY - 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(150)
          .attr('r', cycleNodes.has(d.id) ? 14 : 11)
          .attr('stroke-width', 2);
        tooltip.style('opacity', 0);
      })
      .on('click', (event, d) => {
        setSelectedNode((prev) => prev === d.id ? null : d.id);
      });

    /* ── Tick ── */
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Fit view after simulation settles
    setTimeout(() => fitView(svg, g, W, H, zoom), 1500);

    return () => simulation.stop();
  }, [graphData, cycleNodes, loading]);

  /* ── Highlight searched node ── */
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('.graph-node circle')
      .attr('opacity', (d) => {
        if (!search) return 1;
        return d.id.toLowerCase().includes(search.toLowerCase()) ? 1 : 0.15;
      });
    svg.selectAll('line')
      .attr('opacity', !search ? 0.7 : 0.05);
  }, [search]);

  /* ── Highlight selected node connections ── */
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (!selectedNode) {
      svg.selectAll('.graph-node circle').attr('stroke-width', 2);
      return;
    }
    svg.selectAll('.graph-node circle')
      .attr('stroke-width', (d) => d.id === selectedNode ? 4 : 2)
      .attr('fill', (d) => {
        if (d.id === selectedNode) return COLOR.nodeSelected;
        return cycleNodes.has(d.id) ? COLOR.nodeCycle : COLOR.nodeNormal;
      });
  }, [selectedNode, cycleNodes]);

  /* ── Zoom controls ── */
  const fitView = (svg, g, W, H, zoom) => {
    const bounds = g.node().getBBox();
    if (!bounds.width || !bounds.height) return;
    const scale = Math.min(0.9, 0.9 / Math.max(bounds.width / W, bounds.height / H));
    const tx = (W - scale * (2 * bounds.x + bounds.width)) / 2;
    const ty = (H - scale * (2 * bounds.y + bounds.height)) / 2;
    svg.transition().duration(600).call(
      zoom.transform,
      d3.zoomIdentity.translate(tx, ty).scale(scale)
    );
  };

  const handleZoom = useCallback((factor) => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, factor);
  }, []);

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current || !containerRef.current) return;
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    const g = svg.select('.graph-root');
    fitView(svg, g, W, H, zoomRef.current);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="graph-page">
      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(`/project/${id}`)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="page-title" style={{ fontSize: 18 }}>Dependency Graph</h1>
            <p className="page-subtitle">Interactive force-directed visualization</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Stats badges */}
          <span className="badge badge-blue">{stats.nodes} nodes</span>
          <span className="badge badge-blue">{stats.edges} edges</span>
          {stats.cycles > 0 && <span className="badge badge-red">⚠ {stats.cycles} cycles</span>}

          {/* Search */}
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              className="input-field search-input"
              placeholder="Search nodes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="graph-search"
              style={{ height: 34 }}
            />
          </div>

          {/* Zoom controls */}
          <button className="btn btn-secondary btn-icon" title="Zoom in"  onClick={() => handleZoom(1.3)}><ZoomIn  size={15} /></button>
          <button className="btn btn-secondary btn-icon" title="Zoom out" onClick={() => handleZoom(0.7)}><ZoomOut size={15} /></button>
          <button className="btn btn-secondary btn-icon" title="Fit view"  onClick={handleReset}><Maximize size={15} /></button>
          <button className="btn btn-secondary btn-icon" title="Reset selection" onClick={() => { setSearch(''); setSelectedNode(null); }}>
            <RefreshCcw size={15} />
          </button>
        </div>
      </div>

      {/* ── Graph container ── */}
      <div className="graph-container" ref={containerRef}>
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <span>Building dependency graph…</span>
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No dependencies found</div>
            <p className="empty-state-text">This project has no detected source files or imports.</p>
          </div>
        ) : (
          <>
            <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            {/* Tooltip */}
            <div id="graph-tooltip" className="node-tooltip" style={{ opacity: 0 }} />

            {/* Selected node panel */}
            {selectedNode && (() => {
              const outgoing = graphData.edges.filter(e => e.source.id === selectedNode || e.source === selectedNode);
              const incoming = graphData.edges.filter(e => e.target.id === selectedNode || e.target === selectedNode);

              return (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    position: 'absolute',
                    top: 12, right: 12,
                    width: 300,
                    maxHeight: 'calc(100% - 24px)',
                    overflowY: 'auto',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-lg)',
                    padding: '16px',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                  className="custom-scrollbar"
                >
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Selected Node
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--success)',
                      wordBreak: 'break-all',
                    }}>
                      {selectedNode}
                    </div>
                  </div>

                  {cycleNodes.has(selectedNode) && (
                    <div className="badge badge-red" style={{ alignSelf: 'flex-start' }}>⚠ Circular dependency</div>
                  )}

                  {/* Outgoing (Imports) */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Imports ({outgoing.length})
                    </div>
                    {outgoing.length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>None</div>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {outgoing.slice(0, 10).map(e => {
                          const tid = e.target.id || e.target;
                          return (
                            <li key={`out-${tid}`} style={{ fontFamily: 'var(--font-mono)', color: cycleNodes.has(tid) ? 'var(--danger)' : 'inherit' }}>
                               {tid.split(/[./]/).pop()}
                            </li>
                          );
                        })}
                        {outgoing.length > 10 && <li style={{ fontStyle: 'italic' }}>...and {outgoing.length - 10} more</li>}
                      </ul>
                    )}
                  </div>

                  {/* Incoming (Imported By) */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Imported By ({incoming.length})
                    </div>
                    {incoming.length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>None</div>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {incoming.slice(0, 10).map(e => {
                          const sid = e.source.id || e.source;
                          return (
                            <li key={`in-${sid}`} style={{ fontFamily: 'var(--font-mono)', color: cycleNodes.has(sid) ? 'var(--danger)' : 'inherit' }}>
                               {sid.split(/[./]/).pop()}
                            </li>
                          );
                        })}
                        {incoming.length > 10 && <li style={{ fontStyle: 'italic' }}>...and {incoming.length - 10} more</li>}
                      </ul>
                    )}
                  </div>

                  <button
                    className="btn btn-secondary" onClick={() => setSelectedNode(null)}
                    style={{ fontSize: 12, marginTop: 'auto', padding: '6px' }}
                  >
                    Close Panel
                  </button>
                </motion.div>
              );
            })()}
          </>
        )}

        {/* Legend */}
        <div className="graph-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: COLOR.nodeNormal }} />
            Normal file
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: COLOR.nodeCycle }} />
            In cycle
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: COLOR.nodeSelected }} />
            Selected
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 11 }}>
            <Info size={12} /> Drag nodes · Scroll to zoom
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GraphPage;
