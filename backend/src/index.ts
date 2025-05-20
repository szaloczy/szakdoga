import { app } from "./app";
import { AppDataSource } from "./data-source";
import { port } from "./config";
import { createAdmin } from "./seeds/create-admin";

async function main() {
  await AppDataSource.initialize();

  await createAdmin();

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Server is listening on port: ${port}`);
  });
}

main();
