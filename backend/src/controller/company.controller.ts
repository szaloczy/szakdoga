import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Mentor } from "../entity/Mentor";
import { Controller } from "./base.controller";
import { CompanyDTO } from "../types";

export class CompanyController extends Controller {
  repository = AppDataSource.getRepository(Company);
  mentorRepository = AppDataSource.getRepository(Mentor);

  getAll = async (req, res) => {
    try {
      const { active, city, name } = req.query;

      let queryBuilder = this.repository.createQueryBuilder("company")
        .leftJoinAndSelect("company.mentors", "mentors")
        .leftJoinAndSelect("mentors.user", "mentorUser");

      if (active !== undefined) {
        queryBuilder = queryBuilder.where("company.active = :active", {
          active: active === 'true'
        });
      }

      if (city) {
        queryBuilder = queryBuilder.andWhere("company.city ILIKE :city", {
          city: `%${city}%`
        });
      }

      if (name) {
        queryBuilder = queryBuilder.andWhere("company.name ILIKE :name", {
          name: `%${name}%`
        });
      }

      const companies = await queryBuilder
        .orderBy("company.name", "ASC")
        .getMany();

      const companiesDTO: CompanyDTO[] = companies.map(company => ({
        id: company.id,
        name: company.name,
        city: company.city,
        email: company.email,
        phone: company.phone,
        address: company.address,
        active: company.active,
      }));

      res.json(companiesDTO);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getOne = async (req, res) => {
    try {
      const companyId = Number(req.params["id"]);

      if (isNaN(companyId)) {
        return this.handleError(res, null, 400, "Invalid company ID");
      }

      const company = await this.repository.findOne({
        where: { id: companyId },
        relations: ["mentors", "mentors.user"],
      });

      if (!company) {
        return this.handleError(res, null, 404, "Company not found");
      }

      const companyDTO: CompanyDTO = {
        id: company.id,
        name: company.name,
        city: company.city,
        email: company.email,
        phone: company.phone,
        address: company.address,
        active: company.active,
      };

      res.json(companyDTO);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  create = async (req, res) => {
    try {
      const user = (req as any).user;
      const { name, city, email, phone, address, active = true } = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (user.role !== "admin") {
        return this.handleError(res, null, 403, "Only admins can create companies");
      }

      if (!name || !city || !email || !address) {
        return this.handleError(res, null, 400, "Name, city, email and address are required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return this.handleError(res, null, 400, "Invalid email format");
      }

      const existingCompany = await this.repository.findOne({
        where: { name: name }
      });

      if (existingCompany) {
        return this.handleError(res, null, 409, "Company with this name already exists");
      }

      const company = this.repository.create({
        name,
        city,
        email,
        phone,
        address,
        active,
      });

      const savedCompany = await this.repository.save(company);

      const companyDTO: CompanyDTO = {
        id: savedCompany.id,
        name: savedCompany.name,
        city: savedCompany.city,
        email: savedCompany.email,
        phone: savedCompany.phone,
        address: savedCompany.address,
        active: savedCompany.active,
      };

      res.status(201).json(companyDTO);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  update = async (req, res) => {
    try {
      const user = (req as any).user;
      const companyId = Number(req.params["id"]);
      const { name, city, email, phone, address, active } = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (user.role !== "admin") {
        return this.handleError(res, null, 403, "Only admins can update companies");
      }

      if (isNaN(companyId)) {
        return this.handleError(res, null, 400, "Invalid company ID");
      }

      const company = await this.repository.findOne({
        where: { id: companyId }
      });

      if (!company) {
        return this.handleError(res, null, 404, "Company not found");
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return this.handleError(res, null, 400, "Invalid email format");
        }
      }

      if (name && name !== company.name) {
        const existingCompany = await this.repository.findOne({
          where: { name: name }
        });

        if (existingCompany) {
          return this.handleError(res, null, 409, "Company with this name already exists");
        }
      }

      if (name) company.name = name;
      if (city) company.city = city;
      if (email) company.email = email;
      if (phone !== undefined) company.phone = phone;
      if (address) company.address = address;
      if (active !== undefined) company.active = active;

      const updatedCompany = await this.repository.save(company);

      const companyDTO: CompanyDTO = {
        id: updatedCompany.id,
        name: updatedCompany.name,
        city: updatedCompany.city,
        email: updatedCompany.email,
        phone: updatedCompany.phone,
        address: updatedCompany.address,
        active: updatedCompany.active,
      };

      res.json(companyDTO);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  delete = async (req, res) => {
    try {
      const user = (req as any).user;
      const companyId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (user.role !== "admin") {
        return this.handleError(res, null, 403, "Only admins can delete companies");
      }

      if (isNaN(companyId)) {
        return this.handleError(res, null, 400, "Invalid company ID");
      }

      const company = await this.repository.findOne({
        where: { id: companyId },
        relations: ["mentors", "internships"]
      });

      if (!company) {
        return this.handleError(res, null, 404, "Company not found");
      }

      const activeMentors = await this.mentorRepository.count({
        where: { 
          company: { id: companyId },
          user: { active: true }
        }
      });

      if (activeMentors > 0) {
        return this.handleError(res, null, 400, "Cannot delete company with active mentors");
      }

      await this.repository.remove(company);

      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  deactivate = async (req, res) => {
    try {
      const user = (req as any).user;
      const companyId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (user.role !== "admin") {
        return this.handleError(res, null, 403, "Only admins can deactivate companies");
      }

      if (isNaN(companyId)) {
        return this.handleError(res, null, 400, "Invalid company ID");
      }

      const company = await this.repository.findOne({
        where: { id: companyId }
      });

      if (!company) {
        return this.handleError(res, null, 404, "Company not found");
      }

      company.active = false;
      await this.repository.save(company);

      res.json({ message: "Company deactivated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getMentors = async (req, res) => {
    try {
      const companyId = Number(req.params["id"]);

      if (isNaN(companyId)) {
        return this.handleError(res, null, 400, "Invalid company ID");
      }

      const company = await this.repository.findOne({
        where: { id: companyId },
        relations: ["mentors", "mentors.user"]
      });

      if (!company) {
        return this.handleError(res, null, 404, "Company not found");
      }

      const activeMentors = company.mentors.filter(mentor => mentor.user.active);

      res.json(activeMentors);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  search = async (req, res) => {
    try {
      const { query } = req.query;

      if (!query) {
        return this.handleError(res, null, 400, "Search query is required");
      }

      const companies = await this.repository
        .createQueryBuilder("company")
        .where("company.name ILIKE :query OR company.city ILIKE :query", {
          query: `%${query}%`
        })
        .andWhere("company.active = :active", { active: true })
        .orderBy("company.name", "ASC")
        .getMany();

      const companiesDTO: CompanyDTO[] = companies.map(company => ({
        id: company.id,
        name: company.name,
        city: company.city,
        email: company.email,
        phone: company.phone,
        address: company.address,
        active: company.active,
      }));

      res.json(companiesDTO);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getActive = async (req, res) => {
    try {
      const companies = await this.repository.find({
        where: { active: true },
        order: { name: "ASC" }
      });

      const companiesDTO: CompanyDTO[] = companies.map(company => ({
        id: company.id,
        name: company.name,
        city: company.city,
        email: company.email,
        phone: company.phone,
        address: company.address,
        active: company.active,
      }));

      res.json(companiesDTO);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}