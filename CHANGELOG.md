# Changelog

## 3.1.0
- feature: added immutable-set
- feature: should immutable-del
- patch: fix issue w/ setting number indexes
- patch: improved error messages
- patch: improved readme

## 3.0.0 - rewrote keypather as a string parser!
- breaking!: dropped support for functions
- breaking!: expand doesn't support custom delimeters larger than 1 character
- breaking!: export keypather's modules separately
- feature: bundling keypather into web apps should be much smaller
- feature: should be much more performant
- patch: expand was not creating nested arrays properly [see tests](https://github.com/tjmehta/keypather/pull/26/files)
- patch: this should fix various inconsistencies with parsing old

## 2.0.1
- patch: bug-fix flatten removes empty nested objects

## 2.0.0
- breaking!: default non-existant values to `undefined` vs `null`
- patch: updated 101@v1.5.0

## 1.10.1
- patch: `delimeter` option documentation for `expand` and `flatten`

## 1.10.0
- feature: `keypather.expand`

## 1.9.0
- feature: `keypather.flatten`
- patch: fixed readme typos and examples

## 1.8.1
- patch: fixed bug w/ setting keypaths w/ dots w/in brackets [see added tests](https://github.com/tjmehta/keypather/commit/0904fe7aa0f6556879170424d2781281976e7b28)

## 1.8.0
- feature: added support for keypaths w/ dots w/in brackets

## 1.7.5 (and 1.7.4, same tag, whoops!)
- patch: fixed bug w/ keypaths that have depth greater than three, eg. foo.bar.qux.korge

... more
