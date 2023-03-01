import { describe, it, expect, beforeEach } from 'vitest'
import { InMemorySource } from '../../../src/plugin/InMemorySource'
import { Expect, NotAny } from '../../typeAssertions'

class ContentSourceWrapper<T> extends InMemorySource<T> {
    getRoot() {
        return this.root
    }
}

const content = {
    test: "hello world",
    nested: {
        deeper: "down under",
        again: {
            foo: "bar"
        }
    },
    nested2: {
        bar: "baz"
    }
}

let source: ContentSourceWrapper<typeof content>

describe("InMemorySource", () => {
    beforeEach(() => {
        source = new ContentSourceWrapper(content)
    })

    describe("constructor", () => {
        it('should set root object directly', () => {
            expect(source.getRoot().test).toBe('hello world')
        })
    })

    describe("initialize", () => {
        it('should be initialized after initialize is called', async () => {
            expect(source.initialized.value).toBe(false)
            await source.initialize({ source })
            expect(source.initialized.value).toBe(true)
        })
    })

    describe("readBlock", () => {
        it('should return a block', async () => {
            const block = source.readBlock()
            expect(block.test).toBe("hello world")
            expect(block.$blockMeta.id).toBe("root")
        })

        it('should set id, fieldSettings and modifiedFields', async () => {
            const block = source.readBlock()
            expect(block.$blockMeta.id).not.toBe(undefined)
            expect(block.$blockMeta.fieldSettings).not.toBe(undefined)
            expect(block.$blockMeta.modifiedFields).not.toBe(undefined)
        })

        it('should set id, fieldSettings and modifiedFields', async () => {
            const block = source.readBlock()
            expect(block.$blockMeta.id).not.toBe(undefined)
            expect(block.$blockMeta.fieldSettings).not.toBe(undefined)
            expect(block.$blockMeta.modifiedFields).not.toBe(undefined)
        })

        it('should read nested blocks by field', async () => {
            const root = source.readBlock()
            const block = source.readBlock({
                parent: root,
                field: "nested"
            })
            expect(block.deeper).toBe("down under")
            expect(block.$blockMeta.id).toBe("root.nested")
            expect(block.$blockMeta.fieldSettings).not.toBe(undefined)
            expect(block.$blockMeta.modifiedFields).not.toBe(undefined)
        })

        it('should use root if no parent is given', async () => {
            const block = source.readBlock({
                field: "nested"
            })
            expect(block.$blockMeta.id).toBe("root.nested")
            type test = Expect<NotAny<typeof block["deeper"]>>
            expect(block.deeper).toBe("down under")
        })
    })
})