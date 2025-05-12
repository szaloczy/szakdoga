import { AppDataSource } from "./data-source";
import { port } from "./config";
import app from "./app";

async function main() {
  await AppDataSource.initialize();

  app.listen(port);
  console.log(`Express server has started on port ${port}.`);
}

main();
