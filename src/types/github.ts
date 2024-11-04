import type { Context } from '@actions/github/lib/context'
import type { GitHub } from '@actions/github/lib/utils'

export interface ActionInputs {
    format: string
    dateFormat: string
    tag: boolean
    release?: 'latest' | 'pre'
    githubToken?: string
}

export interface ActionOutputs {
    version: string
}

export interface GitHubContext extends Context {
    payload: {
        repository?: {
            full_name: string
            owner: {
                login: string
            }
            name: string
        }
        pull_request?: {
            number: number
            head: {
                ref: string
                sha: string
            }
        }
    }
}

export type GitHubClient = InstanceType<typeof GitHub> 
