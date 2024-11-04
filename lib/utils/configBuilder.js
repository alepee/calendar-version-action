export class CalverConfigBuilder {
    config = {};
    withFormat(format) {
        this.config.format = format;
        return this;
    }
    withDateFormat(dateFormat) {
        this.config.dateFormat = dateFormat;
        return this;
    }
    withTag(tag) {
        this.config.tag = tag;
        return this;
    }
    withRelease(release) {
        this.config.release = release;
        return this;
    }
    withGithubToken(token) {
        this.config['github-token'] = token;
        return this;
    }
    build() {
        return {
            format: this.config.format ?? '%NOW%-%MICRO%',
            dateFormat: this.config.dateFormat ?? 'YYYY.0M.0D',
            tag: this.config.tag ?? false,
            release: this.config.release,
            'github-token': this.config['github-token']
        };
    }
}
