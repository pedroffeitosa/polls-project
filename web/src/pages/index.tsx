interface HomeProps {
  poolCount: number
  guesseCount: number
  userCount: number
}

import Image from 'next/image'
import Swal from 'sweetalert2'
// import appPreviewImg from '../assets/app-nlw-copa-preview.png'
// import logoImg from '../assets/logo.svg'
import logoImg from '../assets/logo.png'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })
      const { code } = response.data

      await navigator.clipboard.writeText(code)
      Swal.fire({
        icon: 'success',
        title: 'Jogo criado com sucesso',
        text: 'O codigo do jogo foi copiado para a área de transferência',
      })
      setPoolTitle('')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Falha ao gerar o jogo',
        text: 'Ocorreu um erro ao criar o jogo',
      })
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      {/* <div className="grid place-items-center h-screen"> */}
      <main>
        {/* <Image src={logoImg} alt="Noodds" /> */}
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Gere jogos e compartilhe entre amigos!
        </h1>
        {/* <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="Avatar Imagem" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div> */}

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Escolha o nome para a sala de jogos gerados"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700">
            Gerar meu jogo
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após gerar seu jogo, você receberá um código único que poderá usar
          para convidar outras pessoas e todos poderão acompanhar os resultados!
          🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6 ">
            <Image src={iconCheckImg} alt="iconCheck" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Jogos Gerados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"></div>
          <div className="flex items-center gap-6 ">
            <Image src={iconCheckImg} alt="iconCheck" quality={100} />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guesseCount}</span>
              <span>Avaliações Enviadas</span>
            </div>
          </div>
        </div>
      </main>
      {/* <Image
        src={appPreviewImg}
        alt="Dois celular exibindo uma prévida do app da NLW Copa"
        quality={100}
      /> */}
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guesseCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }
}
