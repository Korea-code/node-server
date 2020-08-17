const http = require("http");
const fs = require("fs").promises;

const comments = {};
const server = http
  .createServer(async (req, res) => {
    try {
      if (req.method === "GET") {
        if (req.url === "/") {
          const html = await fs.readFile("./index.html");
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html);
        } else if (req.url === "/comments") {
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify(comments));
        } else {
          try {
            const data = await fs.readFile(`.${req.url}`);
            res.end(data);
          } catch (err) {
            console.error(err);
          }
        }
      } else if (req.method === "POST") {
        if (req.url === "/comment") {
          let fullData = "";
          req.on("data", (data) => {
            fullData += data;
          });
          req.on("end", () => {
            const { comment } = JSON.parse(fullData);
            const id = Date.now();
            comments[id] = comment;
            res.writeHead(201, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("ok");
          });
        }
      } else if (req.method === "PUT") {
        if (req.url.startsWith("/comment/")) {
          const key = req.url.split("/")[2];
          let fullData = "";
          req.on("data", (data) => {
            fullData += data;
          });
          return req.on("end", () => {
            const { comment } = JSON.parse(fullData);
            comments[key] = comment;
            res.writeHead("201", {
              "Content-Type": "text/plain; charset=utf-8",
            });
            res.end("ok");
          });
        }
      } else if (req.method === "DELETE") {
        if (req.url.startsWith("/comment/")) {
          const key = req.url.split("/")[2];
          delete comments[key];
          res.writeHead("201", {
            "Content-Type": "text/plain; charset=utf-8",
          });
          res.end("ok");
        }
      }
    } catch (err) {
      console.error(err);
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(8080);

server.on("listening", () => {
  console.log("server is running on localhost:8080");
});

server.on("error", (error) => {
  console.error(error);
});
