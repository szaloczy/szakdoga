import { app } from "./app";
import { AppDataSource } from "./data-source";
import { port } from "./config";

async function main() {
  await AppDataSource.initialize();

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Server is listening on port: ${port}`);
  });
}

main();
