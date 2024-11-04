import { cleanupTests } from './src/utils/testUtils.js'

beforeEach(() => {
    jest.useFakeTimers()
})

afterEach(() => {
    cleanupTests()
    jest.useRealTimers()
}) 
