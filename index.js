const aoijs = require("aoi.js")



const { Configuration, OpenAIApi } = require('openai');

const bot = new aoijs.Bot({
token: 'MTA1NDAyNzY3ODc2MTYyNzc0OA.GMybKc.s1GvcmUVyeL_ufhAylaC0r-lmduFqXD_uvSkgc',
prefix: "!",
intents: "all"
})

bot.onMessage()





// Manipulador de Comandos
const loader = new aoijs.LoadCommands(bot)
loader.load(bot.cmd,"./commands/")

// Eventos e Variáveis
bot.variables({

    vezentrou: 0,
    coratual: '',
})

bot.functionManager.createCustomFunction({
  name: '$imagine',
  type: 'djs',
  code: async d => {
    let data = d.util.aoiFunc(d);
    let [description] = data.inside.splits;
    if(!description) return d.aoiError.fnError(d, 'custom', {}, 'Missing description to generate a image!');
    const configuration = new Configuration({
      apiKey: process.env['openai']
    });
    const openai = new OpenAIApi(configuration);
    let image = await openai.createImage({
      prompt: `${description}`,
      n: 1,
      size: '1024x1024'
    }).catch(e => console.error(e));
    data.result = image['data']['data'][0]['url'];
    return {
      code: d.util.setCode(data)
    }
  }
}); 


bot.readyCommand({
    channel: "",
    code: `$log[Ready on $userTag[$clientID]]
$log[$getBotInvite]`
})



bot.onInteractionCreate()
bot.onJoin()