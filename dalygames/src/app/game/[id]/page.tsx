import { GameProps } from "@/utils/types/game"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Container } from "@/components/container"
import { Label } from "./components/label"
import { GameCard } from "@/components/GameCard"
import { Metadata } from "next"

interface PropsParams {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: PropsParams): Promise<Metadata> {
    try {
        const response: GameProps = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${params.id}`, { next: { revalidate: 60 } })
            .then((res) => res.json())
            .catch(() => {
                return {
                    title: 'DalyGames - Jogos incríveis para você!',
                }
            })
        return {
            title:response.title,
            description: `${response.description.slice(0, 100)}...`,
            openGraph: {
                title: response.title,
                images: [response.image_url]
            }
        }

    } catch (err) {
        return {
            title: 'DalyGames - Jogos incríveis para você!',
        }
    }

}

async function getData(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game&id=${id}`, { next: { revalidate: 60 } })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

async function getGameSorted() {
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/next-api/?api=game_day`, { cache: "no-cache" })
        return res.json()
    } catch (err) {
        console.log(err)
    }
}

export default async function Game({
    params: { id }
}: {
    params: { id: string }
}) {
    const data: GameProps = await getData(id)
    const sortedGame: GameProps = await getGameSorted()
    

    if (!data) {
        redirect("/")
    }

    return (
        <main className="w-full text-black">
            <div className="bg-black h-80 sm:h-96 w-full relative">
                <Image
                    className="object-cover w-full  h-80 sm:h-96 opacity-80"
                    src={data.image_url}
                    alt="Imagen detalhada do jogo"
                    priority
                    fill={true}
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw"
                />
            </div>
            <Container>
                <h1 className="font-bold text-xl my-4">{data.title}</h1>
                <p>{data.description}</p>

                <h2 className="font-bold text-lg mt-7 mb-2">Plataformas</h2>
                <div className="flex gap-2 flex-wrap">
                    {data.platforms.map((item) => (
                        <Label name={item} key={item} />
                    ))}
                </div>

                <h2 className="font-bold text-lg mt-7 mb-2">Categorias</h2>
                <div className="flex gap-2 flex-wrap">
                    {data.categories.map((item) => (
                        <Label name={item} key={item} />
                    ))}
                </div>

                <p className="mt-7 mb-2"><strong>Data de lancamento:</strong>{data.release}</p>

                <h2 className="font-bold text-lg mt-7 mb-2">Jogo recomendado</h2>
                <div className="flex">
                    <div className="flex-grow">
                        <GameCard data={sortedGame} />
                    </div>
                </div>
            </Container>

        </main>
    )
}
