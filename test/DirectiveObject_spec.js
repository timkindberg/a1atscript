import angular from 'angular.js';
import mock from 'angularMocks.js';

import {DirectiveObject} from '../src/DirectiveObject'

import {
  Module,
  Service
} from '../src/annotations';

import {
  Injector
} from '../src/Injector';

@Service('ExampleService')
class ExampleService {
  constructor() {
    this.value = 'Set within link';
    this.value2 = "Set within callback";
  }

  setValue(scope) {
    scope.value = this.exampleService.value;
  }

}

class ExampleBase {
  constructor() {
    this.restrict = "E";
  }

  link(scope, element, attrs) {
    this.setValue(scope);
    scope.setFromService = () => {
      scope.value2 = this.exampleService.value2;
    }
  }

  setValue(scope) {
    scope.value = this.exampleService.value;
  }
}

@DirectiveObject('exampleDirective', ['ExampleService'])
class ExampleDirective extends ExampleBase {
  constructor(exampleService) {
    super();
    this.exampleService = exampleService;
    this.templateUrl = "template.tpl.html";
  }
  setValue(scope) {
    super.setValue(scope);
    scope.subValue = this.exampleService.value;
  }
}

angular.module("simpleTemplate", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template.tpl.html",
    "<p>Hello</p>");
}]);

var AppModule = new Module('AppModule', ['simpleTemplate', ExampleService, ExampleDirective])

describe("DirectiveObject", function() {
  var scope, element, injector, $compile;

  beforeEach(function() {
    injector = new Injector("AppModule");
    injector.instantiate(AppModule);
    mock.module('AppModule');
    mock.inject(function($rootScope, _$compile_) {
      scope = $rootScope.$new();
      $compile = _$compile_;
      element = '<example-directive></example-directive>';
      element = $compile(element)(scope);
      scope.$digest();
    });
  });

  it("should function as a directive definition object", function() {
    expect(element.find('p').length).toEqual(1);
  });

  describe("linking and this", function() {
    beforeEach(function() {
      scope.setFromService();
    });
    it("should be able to access this from within the link function", function() {
      expect(scope.value).toEqual("Set within link");
      expect(scope.subValue).toEqual("Set within link");
      expect(scope.value2).toEqual("Set within callback");
    })
  });

});