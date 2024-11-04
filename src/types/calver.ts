export type DateFormatToken = 
    | 'YYYY' 
    | 'YY' 
    | '0Y' 
    | 'MM' 
    | '0M' 
    | 'WW' 
    | '0W' 
    | 'DD' 
    | '0D'

export interface CalverConfig {
    format?: string
    dateFormat?: string
    tag?: boolean
    release?: 'latest' | 'pre'
    'github-token'?: string
}

export interface VersionPattern {
    beforeMicro: string
    afterMicro: string
    hasMicro: boolean
}

export interface VersionComponents {
    year: string
    month: string
    day?: string
    week?: string
    micro?: string
} 
