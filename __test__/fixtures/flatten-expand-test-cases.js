/* eslint-env jest */
module.exports.common = [
  // dot keys
  {
    full: { foo: 1 },
    flat: { foo: 1 }
  },

  {
    full: {
      _a: 1,
      $b: 2,
      Ac: 3,
      Zd: 4
    },
    flat: {
      _a: 1,
      $b: 2,
      Ac: 3,
      Zd: 4
    }
  },

  // bracket keys
  {
    full: [1, 2, 3],
    flat: {
      '[0]': 1,
      '[1]': 2,
      '[2]': 3
    }
  },

  {
    full: {
      '!a': 1,
      '@b': 2,
      '#c': 3,
      '&d': 4
    },
    flat: {
      '["!a"]': 1,
      '["@b"]': 2,
      '["#c"]': 3,
      '["&d"]': 4
    }
  },

  // complex
  {
    full: {
      foo: { a: 1, b: 2, c: 3 },
      bar: [1, 2, 3]
    },
    flat: {
      'foo.a': 1,
      'foo.b': 2,
      'foo.c': 3,
      'bar[0]': 1,
      'bar[1]': 2,
      'bar[2]': 3
    }
  },

  {
    full: {
      foo: { a: 1, b: 2, c: 3 },
      bar: [{ a: 1 }, { b: 2 }, { c: 3 }]
    },
    flat: {
      'foo.a': 1,
      'foo.b': 2,
      'foo.c': 3,
      'bar[0].a': 1,
      'bar[1].b': 2,
      'bar[2].c': 3
    }
  },

  {
    full: [
      {
        foo: { bar: 100 },
        qux: [200, { baz: true }]
      },
      'hello'
    ],
    flat: {
      '[0].foo.bar': 100,
      '[0].qux[0]': 200,
      '[0].qux[1].baz': true,
      '[1]': 'hello'
    }
  },

  {
    full: [
      {
        foo: { 'bar.qux': 100 }
      },
      'hello'
    ],
    flat: {
      '[0].foo["bar.qux"]': 100,
      '[1]': 'hello'
    }
  },

  {
    full: [
      {
        foo: { bar: 100 },
        qux: Object.assign([200, { baz: true }], { foo: 'foo' })
      },
      'hello'
    ],
    flat: {
      '[0].foo.bar': 100,
      '[0].qux.foo': 'foo',
      '[0].qux[0]': 200,
      '[0].qux[1].baz': true,
      '[1]': 'hello'
    },
    expandAssert: function (testCase, expanded) {
      expect(expanded).toEqual(expect.arrayContaining(testCase.full))
      expect(expanded[0].qux).toEqual(expect.arrayContaining(testCase.full[0].qux))
    }
  },

  // opts: delimeter
  {
    full: {
      foo: { a: 1, b: 2, c: 3 },
      bar: [1, 2, 3]
    },
    flat: {
      'foo-a': 1,
      'foo-b': 2,
      'foo-c': 3,
      'bar[0]': 1,
      'bar[1]': 2,
      'bar[2]': 3
    },
    opts: '-'
  }
]

module.exports.flatten = [
  // opts:
  // delimeter
  {
    full: { foo: 1 },
    flat: { foo: 1 },
    opts: {
      delimeter: ','
    }
  },

  {
    full: { foo: { bar: 1 } },
    flat: { 'foo,bar': 1 },
    opts: {
      delimeter: ','
    }
  },

  {
    full: { foo: { bar: 1 } },
    flat: { 'foo,bar': 1 },
    opts: ','
  }
]
