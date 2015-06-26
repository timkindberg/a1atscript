import {bootstrap} from "../src/a1atscript/bootstrap";
import {Injector} from "../src/a1atscript/Injector";
import {Router} from "../src/a1atscript/Router";

describe('bootstrap', function() {

  beforeEach(function() {
    this.appModule = function App(){};
    this.appModule.routeConfig = [{route:'/', component:'child'}]
    spyOn(Injector.prototype, 'instantiate').and.returnValue('foo');
    spyOn(Router.routeInitializer, 'initialize');
  });

  it('should instantiate a new app module', function() {
    bootstrap(this.appModule);
    expect(Injector.prototype.instantiate).toHaveBeenCalledWith(this.appModule);
  });

  it('should initialize router if route config is present', function() {
    bootstrap(this.appModule);
    expect(Router.routeInitializer.initialize).toHaveBeenCalledWith(jasmine.any(String), this.appModule);
  });

  it('should not initialize router if route config is not being used', function() {
    this.appModule.routeConfig = [];
    bootstrap(this.appModule);
    expect(Router.routeInitializer.initialize).not.toHaveBeenCalled();
  });
});