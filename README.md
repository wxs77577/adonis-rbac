# adonis-rbac

## Install

```bash
adonis install adonis-rbac --yarn
```

## Setup
1. Add provider in `/start/app.js`
    ```js
    const providers = [
      //...
      'adonis-rbac/providers/RbacProvider',
    ]
    ```


1. Add trait in `/app/Models/User.js`

    ```js
    class User extends Model {

      static get traits() {
        return [
          '@provider:Rbac/Traits/Rbac'
        ]
      }

      //...or if you need to customize the field name...

      static boot () {
        super.boot()

        this.addTrait('@provider:Rbac/Traits/Rbac', {
          field: 'roles' //default is `roles`
        })
      }
    }
    ```

## Usage
1. Define `roles` in `/config/rbac.js`
    ```js
    /**
    * 
    * Configurations for adonis-rbac
    * 
    * Permission format: <resource>.<operation>
    * e.g: posts.index, posts.update, posts.delete
    * 
    * tip: define roles sorting by permissions asc.
    */
    module.exports = {
      roles: {
        // <roleName>: [...<permissions>]
        user: ['posts.index', 'posts.show'],

        // use `role:<roleName>` to grant all permissions for <roleName>
        editor: ['role:user', 'posts.create', 'posts.update'],

        // use `posts.*` to allow all operations for posts
        admin: ['role:editor', 'posts.*'],

        // use `*` to grant all permissions
        system: ['*']
      },
    }
    ````

1. Set `roles` on user
    ```js
    user.roles = ['admin']
    
    /* or string split by comma*/
    user.roles = 'admin,editor'

    ```
1. Use `.can()` in middleware or controller actions.
    ```js
    const { HttpException } = require('@adonisjs/generic-exceptions')

    if (!auth.user.can('posts.index')) {
      throw new HttpException('Forbidden.', 403)
    }
    ```