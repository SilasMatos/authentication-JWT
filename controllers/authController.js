const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const checkToken = require('../middleware/checkToken')

// Função para registro de usuário
exports.register = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  if (!name) {
    return res.status(422).json({ msg: 'O nome é obrigatorio!!' })
  }
  if (!email) {
    return res.status(422).json({ msg: 'O email é obrigatorio!!' })
  }

  if (!password) {
    return res.status(422).json({ msg: 'O password é obrigatorio!!' })
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ msg: 'As senhas não conferem!' })
  }

  const userExists = await User.findOne({ email: email })
  if (userExists) {
    return res.status(422).json({ msg: 'Esse email já existe!' })
  }

  const saut = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, saut)

  const user = new User({
    name,
    email,
    password: passwordHash
  })

  try {
    await user.save()
    res.status(201).json({ msg: 'Usuario criado com sucesso!' })
  } catch (error) {
    res.status(500).json({ msg: 'erro no servidor' })
  }
}

// Função para autenticação de usuário
exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(422).json({ msg: 'O email é obrigatorio!!' })
  }

  if (!password) {
    return res.status(422).json({ msg: 'O password é obrigatorio!!' })
  }

  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(404).json({ msg: 'Usuario não encontrado!' })
  }

  const checkpassword = await bcrypt.compare(password, user.password)

  if (!checkpassword) {
    return res.status(422).json({ msg: 'Senha Invalida!' })
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign(
      {
        id: user._id
      },
      secret
    )

    res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'erro no servidor' })
  }
}

exports.getUserById = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id, '-password')

  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado!' })
  }

  res.status(200).json({ user })
}
