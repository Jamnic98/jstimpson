import { type Metadata } from 'next'

import { DiceModelViewer, PageHeader, ProjectGallery } from 'components'

const pageTitle = '3D Modelling'
const diceImageFolder = '/images/blender/dice'

export const metadata: Metadata = {
  title: pageTitle,
}

export default function threeD() {
  return (
    <>
      <PageHeader
        title={pageTitle}
        description="A collection of 3D models and renders I created using the computer graphics software Blender."
      />
      <article className="mb-16">
        <section className="my-12">
          <h2 className="mb-8 text-4xl font-semibold">Dice</h2>

          <h3 className="text-2xl">3D Model</h3>
          <hr className="my-4 border-gray-300" />
          <DiceModelViewer />
        </section>

        <section className="my-12">
          <h3 className="text-2xl">Renders</h3>
          <hr className="my-4 border-gray-300" />
          <ProjectGallery
            screenshotURIs={[
              `${diceImageFolder}/action_dice.webp`,
              `${diceImageFolder}/mysterious_dice.webp`,
              `${diceImageFolder}/test_v8_composite.webp`,
              `${diceImageFolder}/blue_and_yellow.webp`,
              `${diceImageFolder}/dice_sunset_v3.webp`,
              `${diceImageFolder}/dice_party_v3.webp`,
            ]}
            isBlenderImage={true}
          />
        </section>

        <section className="my-12">
          <h3 className="text-2xl">Description</h3>
          <hr className="my-4 border-gray-300" />
          <p className="mb-4 text-justify text-xl">
            This model went through a couple of iterations before I settled on the final design.
            Getting the right combination of lighting and materials for the dice was also
            challenging as I wanted the dice to appear as realistic as possible. By experimented
            with different lighting, backgrounds, camera angles and materials, I was able to achieve
            a look that I was happy with. I rendered many images of the dice, but have only included
            a few of my favorites here.
          </p>
          <p className="mb-4 text-justify text-xl">
            My favourite part of this project was trying to personify the dice and give them a sense
            of character—especially in the shots where they're lying on the ground together. By
            placing two dice close together and rotating them so the dots face the camera, they
            appear to be gazing out beyond the scene, as if admiring the view.
          </p>
        </section>

        {/* <section className="my-12 text-xl text-red-950">*** more coming soon! ***</section> */}
      </article>
    </>
  )
}
