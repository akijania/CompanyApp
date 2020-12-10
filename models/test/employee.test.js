const Employee = require('../employees.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if no "firstName", "lastName", "department" arg', () => {
    const emp = new Employee({}); // create new Department, but don't set `name` attr value

    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  it('should throw an error if "firstName", "lastName", "department" are not a string', () => {
    const cases = [
      { firstName: {}, lastName: {}, department: {} },
      { firstName: [], lastName: [], department: [] },
    ];
    for (let arg of cases) {
      const emp = new Employee(arg);

      emp.validate((err) => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if "firstName", "lastName", "department" are okay', () => {
    const cases = [
      { firstName: 'John', lastName: 'Doe', department: 'It' },
      { firstName: 'abc', lastName: 'abc', department: 'abc' },
    ];
    for (let arg of cases) {
      const emp = new Employee(arg);

      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });

  after(() => {
    mongoose.models = {};
  });
});
