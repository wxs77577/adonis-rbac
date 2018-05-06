
module.exports = class Rbac {

  async handle(ctx, next) {
    const { auth } = ctx
    await next()
  }

}