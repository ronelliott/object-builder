'use strict';

var should = require('should'),
    sinon = require('sinon'),
    builder = require('./object-builder');

describe('object-builder', function() {
    it('should allow an array to be passed in for the fields', function() {
        Object.keys(builder([ 'foo', 'bar' ])).should.eql([ 'foo', 'bar' ]);
    });

    it('should allow an object to be passed in for the fields', function() {
        Object.keys(builder({ foo: 'foo', bar: 'bar' })).should.eql([ 'foo', 'bar' ]);
    });

    it('should allow a function to be passed in for the resolutions', function() {
        function resolver(name) {
            return name + name.charAt(name.length - 1);
        }

        builder({ foo: 'foo', bar: 'bar' }, resolver).should.eql({
            foo: 'fooo',
            bar: 'barr'
        });
    });

    it('should allow an object to be passed in for the resolutions', function() {
        builder({
            foo: 'foo',
            bar: 'bar'
        }, {
            foo: 'fooo',
            bar: 'barr'
        }).should.eql({
            foo: 'fooo',
            bar: 'barr'
        });
    });

    it('should allow any number of functions or objects to be passed in for the resolutions', function() {
        function resolver(name) {
            return [ 'foo', 'bar'].indexOf(name) !== -1 ? name + name.charAt(name.length - 1) : undefined;
        }

        builder({
            foo: 'foo',
            bar: 'bar',
            dar: 'dar',
            zar: 'zar'
        }, resolver, {
            dar: 'dara',
            zar: 'zara'
        }).should.eql({
            foo: 'fooo',
            bar: 'barr',
            dar: 'dara',
            zar: 'zara'
        });
    });

    it('should resolve the correct nested value', function() {
        builder({
            foo: 'foo.bar',
            bar: 'bar.foo'
        }, {
            foo: {
                bar: 'fooo'
            },
            bar: {
                foo: 'barr'
            }
        }).should.eql({
                foo: 'fooo',
                bar: 'barr'
            });
    });
});
