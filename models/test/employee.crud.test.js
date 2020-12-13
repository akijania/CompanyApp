const Employee = require('../employees.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getConnectionString();

      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(err);
    }
  });
  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'EmpName #1',
        lastName: 'EmpLastName #1',
        department: 'Department #1',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'EmpName #2',
        lastName: 'EmpLastName #2',
        department: 'Department #2',
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'EmpName #1',
      });
      const expectedName = 'EmpName #1';
      expect(employee.firstName).to.be.equal(expectedName);
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'EmpName #1',
        lastName: 'EmpLastName #1',
        department: 'Department #1',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Updating data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'EmpName #1',
        lastName: 'EmpLastName #1',
        department: 'Department #1',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'EmpName #2',
        lastName: 'EmpLastName #2',
        department: 'Department #2',
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        {
          firstName: 'EmpName #1',
        },
        {
          $set: {
            firstName: '=EmpName #1=',
            lastName: '=EmpLastName #1=',
          },
        }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=EmpName #1=',
      });
      const updatedEmployee2 = await Employee.findOne({
        lastName: '=EmpLastName #1=',
      });
      expect(updatedEmployee).to.not.be.null;
      expect(updatedEmployee2).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'EmpName #2',
      });
      employee.firstName = '=EmpName #2=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=EmpName #2=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany(
        {},
        {
          $set: {
            department: '=Department #2=',
          },
        }
      );
      const employees = await Employee.find();
      expect(employees[0].department).to.be.equal('=Department #2=');
      expect(employees[1].department).to.be.equal('=Department #2=');
    });
  });
  describe('Removing data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'EmpName #1',
        lastName: 'EmpLastName #1',
        department: 'Department #1',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'EmpName #2',
        lastName: 'EmpLastName #2',
        department: 'Department #2',
      });
      await testEmpTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({
        firstName: 'EmpName #1',
      });

      const removedEmployee = await Employee.findOne({
        firstName: 'EmpName #1',
      });
      expect(removedEmployee).to.be.null;
    });
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'EmpName #2' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'EmpName #2',
      });
      expect(removedEmployee).to.be.null;
    });
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
  after(() => {
    mongoose.models = {};
  });
});
