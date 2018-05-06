
const { ServiceProvider } = require.main.require('@adonisjs/fold')

module.exports = class RbacProvider extends ServiceProvider {

  register() {
    
    this.app.bind('Rbac/Traits/Rbac', () => {
      
      return new (require('../src/Traits/Rbac'))
    })
    this.app.bind('Rbac/Middleware/Rbac', () => {
      return new (require('../src/Middlware/Rbac'))
    })
    
  }

}