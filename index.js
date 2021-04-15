const { UserSession, UserSessions } = require('./models/UserSessions')
const { UserMessage, UserMessages } = require('./models/UserMessages')
const { HAPPY_SMILES, SAD_SMILES, ANGRY_SMILES } = require('./utils/smiles')
const { HAPPY_ANSWERS, SAD_ANSWERS, ANGRY_ANSWERS, UNKNOWN_ANSWERS } = require('./utils/answers')
const { USER_ID, SESSION_TIMEOUT } = require('./utils/constants')
const _ = require('lodash')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const getRandomAnswerFactory = (ANSWERS) => () => {
    return ANSWERS[_.random(0, ANSWERS.length - 1)]
}

const getRandomHappyAnswer = getRandomAnswerFactory(HAPPY_ANSWERS)
const getRandomSadAnswer = getRandomAnswerFactory(SAD_ANSWERS)
const getRandomAngryAnswer = getRandomAnswerFactory(ANGRY_ANSWERS)
const getRandomUnknownAnswer = getRandomAnswerFactory(UNKNOWN_ANSWERS)

rl.on('line', async (input) => {
    const userSessions = await (new UserSessions).fetch({
        where: `user_id = ${USER_ID}`,
        groupDESC: true,
        group: ['created_at'],
    })
    let userSession = new UserSession()

    if (userSessions?.[0]) {
        await userSession.fetch(userSessions?.[0].id)
    }

    if (!userSession.id) {
        userSession = new UserSession({
            user_id: USER_ID,
        })

        await userSession.save()
        await userSession.fetch(userSession.id)
    }

    // Сравниваем время сессии (из текущего времени вычитаем 3 часа)
    if (userSession.attributes.created_at.getTime() + SESSION_TIMEOUT < (Date.now() - 3 * 60 * 60 * 1000)) {
        userSession.set('finished_at', new Date(Date.now()))
        await userSession.save()

        // Создаем новую сессию
        userSession = new UserSession({
            user_id: USER_ID,
        })

        await userSession.save()
    }

    const userMessage = new UserMessage({
        user_id: USER_ID,
        text: input,
        session_id: userSession.id,
    })

    await userMessage.save()

    if (HAPPY_SMILES.includes(input)) {
        console.log(`Бот: ${getRandomHappyAnswer()}`)

        return
    }

    if (SAD_SMILES.includes(input)) {
        console.log(`Бот: ${getRandomSadAnswer()}`)

        return
    }

    if (ANGRY_SMILES.includes(input)) {
        console.log(`Бот: ${getRandomAngryAnswer()}`)

        return
    }

    console.log(`Бот: ${getRandomUnknownAnswer()}`)
})
