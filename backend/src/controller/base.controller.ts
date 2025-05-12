import { Repository } from "typeorm";

export abstract class Controller {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repository: Repository<any>;

  getAll = async (req, res) => {
    try {
      const entities = await this.repository.find();
      res.json(entities);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  getOne = async (req, res) => {
    try {
      const id = req.params["id"];
      const entity = await this.repository.findOneBy({ id: id });

      if (!entity) {
        res.status(404).json({ message: "The given id does not exist." });
        return;
      }

      res.json(entity);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  create = async (req, res) => {
    try {
      const entityToCreate = this.repository.create(req.body);
      delete entityToCreate.id;

      const entityCreated = await this.repository.save(entityToCreate);
      res.json(entityCreated);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  update = async (req, res) => {
    try {
      const entityToUpdate = this.repository.create(req.body);

      const currentEntity = await this.repository.findOneBy({
        id: entityToUpdate.id,
      });
      if (!currentEntity) {
        res.status(404).json({ message: "The given id does not exist." });
        return;
      }

      const entityUpdated = await this.repository.save(entityToUpdate);
      res.json(entityUpdated);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params["id"];
      const entityToDelete = await this.repository.findOneBy({ id: id });

      if (!entityToDelete) {
        res.status(404).json({ message: "The given id does not exist." });
        return;
      }

      await this.repository.remove(entityToDelete);
      res.send();
    } catch (err) {
      this.handleError(res, err);
    }
  };

  handleError = (res, err, status = 500, message = "Unknown server error.") => {
    if (err) {
      console.error(err);
    }

    res.status(status).json({ message });
  };
}
