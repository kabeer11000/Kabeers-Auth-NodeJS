const kauth = {
    genState: function (length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = length - 1; i >= 0; i--) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    auth_url: undefined,
    init: async (app_id, claims, response_type = 'code', callback = function () {
    }) => {
        if (!app_id || claims || response_type || callback) {
            throw new Error('Some Parameters Were Invalid, Please Double Check your code');
            return false;
        }
        this.auth_url = `https://kabeers-auth.herokuapp.com/user/authorize/${app_id}/${claims}/${response_type}/${callback}/${this.genState(10)}`;
        if (this.auth_url) return true;
    },
    redirect: function () {
        if (!this.auth_url) throw new Error('Init Method Not Called');
        window.location.href = this.auth_url;
    },
    render: async (container, height, width, theme) => {
        if (!this.auth_url) throw new Error('Init Method Not Called');
        if (theme === 'light') {
            container.innerHTML = `<div class="k-net-auth-btn KAuth-${this.genState(20)}"><a href="${this.auth_url}"><img alt="Login With Kabeers Network" src="https://cdn.jsdelivr.net/gh/kabeer11000/k-auth-sdk/dist/light.svg" style="width:${width};height:${height};"></a></div>`;
        } else {
            container.innerHTML = `<div class="k-net-auth-btn KAuth-${this.genState(20)}"><a href="${this.auth_url}"><img alt="Login With Kabeers Network" src="https://cdn.jsdelivr.net/gh/kabeer11000/k-auth-sdk/dist/dark.svg" style="width:${width};height:${height};"></a></div>`;
        }
    }
};
kauth.init('cascb94164a10fa702c09aa0f3e2fd3f8e77a73e', 'FB17A89BB32F42AA1DFAA59D27637:charts_data', 'code').then(() => {
    kauth.render(/*Container Element*/ document.querySelector('div'), /*Height*/ '3rem', /*Width*/ 'auto', 'dark');
});
