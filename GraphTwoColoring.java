import java.util.*;

public class GraphTwoColoring {
    public static void main(String[] args) {
        // Provide the graph as a variable in code:
        String input = "[10,[[0,3],[1,3],[5,8],[0,8],[3,7],[5,9],[6,8],[0,9],[6,9],[2,8],[3,5],[4,9]]]";

        // You can replace input with any graph string in the format [n, [[u,v],...]]
        if (input == null || input.isEmpty()) {
            System.out.println("[]");
            return;
        }

        // Parse format like [10,[[0,3],[1,3],...]]
        String clean = input.trim();
        if (!clean.startsWith("[") || !clean.endsWith("]")) {
            System.out.println("[]");
            return;
        }

        clean = clean.substring(1, clean.length() - 1).trim();
        int comma = -1;
        int brace = 0;
        for (int i = 0; i < clean.length(); i++) {
            char c = clean.charAt(i);
            if (c == '[') brace++;
            else if (c == ']') brace--;
            else if (c == ',' && brace == 0) { comma = i; break; }
        }
        if (comma == -1) {
            System.out.println("[]");
            return;
        }
        String nStr = clean.substring(0, comma).trim();
        String edgesPart = clean.substring(comma + 1).trim();

        int n;
        try {
            n = Integer.parseInt(nStr);
        } catch (NumberFormatException e) {
            System.out.println("[]");
            return;
        }

        List<List<Integer>> edges = new ArrayList<>();
        if (!edgesPart.isEmpty()) {
            // remove outer brackets if present
            if (edgesPart.startsWith("[" ) && edgesPart.endsWith("]")) {
                edgesPart = edgesPart.substring(1, edgesPart.length() - 1).trim();
            }
            // parse edges of form [u,v]
            int i = 0;
            while (i < edgesPart.length()) {
                while (i < edgesPart.length() && Character.isWhitespace(edgesPart.charAt(i))) i++;
                if (i >= edgesPart.length()) break;
                if (edgesPart.charAt(i) != '[') { i++; continue; }
                int j = edgesPart.indexOf(']', i);
                if (j == -1) break;
                String pair = edgesPart.substring(i + 1, j);
                String[] nums = pair.split(",");
                if (nums.length == 2) {
                    try {
                        int u = Integer.parseInt(nums[0].trim());
                        int v = Integer.parseInt(nums[1].trim());
                        edges.add(Arrays.asList(u, v));
                    } catch (NumberFormatException ex) {
                        // ignore invalid
                    }
                }
                i = j + 1;
            }
        }

        List<List<Integer>> graph = new ArrayList<>(n);
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (List<Integer> e : edges) {
            if (e.size() != 2) continue;
            int u = e.get(0), v = e.get(1);
            if (u < 0 || u >= n || v < 0 || v >= n) continue;
            graph.get(u).add(v);
            graph.get(v).add(u);
        }

        int[] color = new int[n];
        Arrays.fill(color, -1);
        boolean ok = true;
        for (int i = 0; i < n; i++) {
            if (color[i] != -1) continue;
            color[i] = 0;
            Queue<Integer> q = new ArrayDeque<>();
            q.add(i);
            while (!q.isEmpty() && ok) {
                int u = q.poll();
                for (int v : graph.get(u)) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        q.add(v);
                    } else if (color[v] == color[u]) {
                        ok = false;
                        break;
                    }
                }
            }
            if (!ok) break;
        }

        if (!ok) {
            System.out.println("[]");
            return;
        }

        StringBuilder out = new StringBuilder("[");
        for (int i = 0; i < n; i++) {
            out.append(color[i]);
            if (i < n - 1) out.append(",");
        }
        out.append("]");
        System.out.println(out);
    }
}
