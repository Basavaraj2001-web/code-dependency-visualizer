package com.example.dependencyvisualizer.util;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class DependencyParser {

    // Regex to match Java import statements: import com.example.MyClass;
    private static final Pattern JAVA_IMPORT_PATTERN = Pattern.compile("^\\s*import\\s+([\\w.]+)\\s*;?\\s*$");
    private static final Pattern JAVA_PACKAGE_PATTERN = Pattern.compile("^\\s*package\\s+([\\w.]+)\\s*;?\\s*$");

    // Regex to match JS/TS import statements: import ... from 'module';
    private static final Pattern JS_IMPORT_PATTERN = Pattern.compile("^\\s*import\\s+.*\\s+from\\s+['\"]([^'\"]+)['\"]\\s*;?\\s*$");
    // Regex to match JS require: const x = require('module');
    private static final Pattern JS_REQUIRE_PATTERN = Pattern.compile("require\\s*\\(\\s*['\"]([^'\"]+)['\"]\\s*\\)");

    /**
     * Parses a source file to extract its package/module info and import dependencies.
     */
    public ParseResult parse(String filePath, String fileName) {
        String baseName = fileName.toLowerCase();
        boolean isJava = baseName.endsWith(".java");
        
        String packageName = null;
        List<String> imports = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (isJava) {
                    Matcher pkgMatcher = JAVA_PACKAGE_PATTERN.matcher(line);
                    if (pkgMatcher.matches() && packageName == null) {
                        packageName = pkgMatcher.group(1);
                    }

                    Matcher importMatcher = JAVA_IMPORT_PATTERN.matcher(line);
                    if (importMatcher.matches()) {
                        imports.add(importMatcher.group(1));
                    }
                } else {
                    // It's JS/TS
                    Matcher importMatcher = JS_IMPORT_PATTERN.matcher(line);
                    if (importMatcher.find()) { // use find instead of matches to handle inline code trailing
                        imports.add(importMatcher.group(1));
                    } else {
                        Matcher reqMatcher = JS_REQUIRE_PATTERN.matcher(line);
                        while (reqMatcher.find()) {
                            imports.add(reqMatcher.group(1));
                        }
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + filePath + " - " + e.getMessage());
        }

        return new ParseResult(packageName, imports);
    }

    public static class ParseResult {
        public final String packageName;
        public final List<String> imports;

        public ParseResult(String packageName, List<String> imports) {
            this.packageName = packageName;
            this.imports = imports;
        }
    }
}
