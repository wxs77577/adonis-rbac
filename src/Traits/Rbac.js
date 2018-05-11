const Config = use('Config')
const _ = require('lodash')

module.exports = class Rbac {

  register(Model, options) {
    const that = this
    Model.prototype.getPermissions = function () {
      const roles = that.fetchRoles()
      if (!this.roles) {
        return []
      }

      let myRoles = []

      if (_.isArray(this.roles)) {
        myRoles = this.roles
      }

      if (_.isString(this.roles)) {
        myRoles = this.roles.split(',')
      }

      let perms = new Set
      _.mapValues(_.pick(roles, myRoles), items => {
        items.forEach(item => perms.add(item))
      })
      return [...perms]
    }

    Model.prototype.isRole = function () {
      return true
    }

    Model.prototype.can = function (permission) {
      const perms = this.getPermissions()
      if (perms.includes('*')) {
        return true
      }
      if (perms.includes(permission)) {
        return true
      }
      if (permission.includes('.')) {
        const [resource, action] = permission.split('.')
        if (perms.includes(`${resource}.*`)) {
          return true
        }
      }
      console.error('rbac:', permission, false)
      return false
    }
  }

  fetchRoles() {
    const { roles, permissions } = Config.get('rbac', {})
    const flatten = (name) => {
      let ret = roles[name].map((v, k) => {
        if (String(v).includes('role:')) {
          const subRole = v.split(':').pop()
          v = flatten(subRole)
        }
        return v
      })

      return _.flatMap(ret)

    }

    _.mapValues(roles, (perms, name) => {
      roles[name] = flatten(name)
    })
    return roles
  }
}
