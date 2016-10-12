const router = new Sentinella.Router(document.documentElement)
router.define({})

QUnit.module("hello")
QUnit.test("truth", (assert) => {
  assert.ok(true)
})
