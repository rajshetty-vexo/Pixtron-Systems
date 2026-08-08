import { defineConfig, Connect, ViteDevServer, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load env variables (like RESEND_API_KEY) into process.env
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    server: {
      host: "::",
      port: 3000,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      mode === "development" && componentTagger(),
      {
        name: "api-routes-middleware",
        configureServer(server: ViteDevServer) {
          server.middlewares.use(async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
            if (!req.url?.startsWith("/api")) {
              return next();
            }

            let body = "";
            req.on("data", (chunk: Buffer | string) => {
              body += chunk.toString();
            });

            req.on("end", async () => {
              try {
                if (body) {
                  (req as any).body = JSON.parse(body);
                }
              } catch (e) {
                (req as any).body = {};
              }

              res.json = (payload: unknown) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(payload));
              };
              res.status = (statusCode: number) => {
                res.statusCode = statusCode;
                return res;
              };

              try {
                if (req.url?.startsWith("/api/brochure") && req.method === "POST") {
                  const brochureModule = await server.ssrLoadModule("./api/brochure.ts");
                  return brochureModule.default(req, res);
                }

                if (req.url?.startsWith("/api/contact") && req.method === "POST") {
                  const contactModule = await server.ssrLoadModule("./api/contact.ts");
                  return contactModule.default(req, res);
                }

                next();
              } catch (error) {
                console.error("API Error:", error);
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" }));
              }
            });
          });
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/src": path.resolve(__dirname, "./src"),
      },
    },
  };
});