const kauth = {
    genState(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = length - 1; i >= 0; i--) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    auth_url: undefined,
    async init(app_id, claims, response_type = 'code', callback, prompt = 'consent') {
        if (!app_id || !claims || !response_type || !callback || !['consent', 'none', 'select_account'].includes(prompt)) {
            throw new Error('Some Parameters Were Invalid, Please Double Check your code');
        }
        claims.join('|');
        this.auth_url = `https://kabeers-auth.herokuapp.com/user/authorize/${app_id}/${claims}/${response_type}/${encodeURIComponent(callback)}/${prompt}/${this.genState(10)}`;
        if (this.auth_url) return true;
    },
    redirect() {
        if (!this.auth_url) throw new Error('Init Method Not Called');
        window.location.href = this.auth_url;
    },
    async render(container, height, width, theme) {
        if (!this.auth_url) throw new Error('Init Method Not Called');
        if (theme === 'light') {
            container.innerHTML = `<div class="k-net-auth-btn KAuth-${this.genState(20)}"><a href="${this.auth_url}"><img alt="Login With Kabeers Network" src="https://cdn.jsdelivr.net/gh/kabeer11000/k-auth-sdk/dist/light.svg" style="width:${width};height:${height};"></a></div>`;
        } else {
            container.innerHTML = `<div class="k-net-auth-btn KAuth-${this.genState(20)}"><a href="${this.auth_url}"><img alt="Login With Kabeers Network" src="https://cdn.jsdelivr.net/gh/kabeer11000/k-auth-sdk/dist/dark.svg" style="width:${width};height:${height};"></a></div>`;
        }
    }
};
kauth.init('cascb94164a10fa702c09aa0f3e2fd3f8e77a73e', ['FB17A89BB32F42AA1DFAA59D27637:charts_data'], 'code').then(() => {
    kauth.render(/*Container Element*/ document.querySelector('res'), /*Height*/ '3rem', /*Width*/ 'auto', 'dark');
});
module.exports = function (options) {
    return function (err, req, res, next) {
        const https = require('https');

        function k_http({body, ...options}) {
            return new Promise((resolve, reject) => {
                const req = https.request({
                    ...options,
                }, res => {
                    const chunks = [];
                    res.on('data', data => chunks.push(data));
                    res.on('end', () => {
                        let body = Buffer.concat(chunks);
                        switch (res.headers['content-type']) {
                            case 'application/json':
                                body = JSON.parse(body);
                                break;
                        }
                        resolve(body)
                    });
                });
                req.on('error', reject);
                if (body) {
                    req.write(body);
                }
                req.end();
            });
        }

        if (req.params.code) {
            k_http({
                method: 'POST',
                hostname: 'kabeers-auth.herokuapp.com',
                path: `/user/token`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    client_secret: options.client_secret,
                    client_public: options.client_public,
                    auth_code: req.params.code,
                })
            }).then(tokens => {
                req.KTokens = tokens
            });
        }
    }
};
