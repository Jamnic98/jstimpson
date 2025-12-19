import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const ukGardenBirdClassifierId = 'uk-garden-bird-classifier'
const ukGardenBirdClassifierAppId = 'uk-garden-bird-classifier-app'

const ukGardenBirdClassifierApp: Project = {
  id: ukGardenBirdClassifierAppId,
  title: 'UK Garden Bird Classifier',
  summary: 'A custom CNN model trained to recognise common UK garden birds.',
  paragraphs: [
    `
  This project began as an experiment in building a custom convolutional neural network from scratch using Pytorch. I created a web scraper to gather training data from Bing, focusing on the species I’m most likely to see in a UK garden. The scraper produced roughly 120 unique images per class, giving me a balanced dataset to work with.
  `,
    `
  My initial model used a simple CNN architecture with only a couple of convolutional layers. While it performed well on the training data, validation accuracy was poor. This was an early sign of overfitting, so I began iterating on the design. I deepened the network, introduced max pooling after each layer, and added dropout to improve generalisation.
  `,
    `
  To further strengthen the model, I relied on real-time data augmentation through a Pytorch dataloader rather than pre-augmenting the dataset. This helped the model see more variation and reduced overfitting. I also enabled multiple workers in the dataloader to avoid GPU bottlenecks while training on my own graphics card.
  `,
    `
  After several rounds of tuning, the final model reached an accuracy of 97.8% with validation accuracy in the nineties, which confirmed the improvements were working. The results were strong across all classes and generalised well beyond the training set.
  `,
    `
  Once the model was trained, I exported it to ONNX and built a FastAPI service to handle predictions. Images uploaded via a Jinja2 frontend are encoded to base64, sent to the API, decoded, and preprocessed into the correct tensor format for inference. The API returns the predicted bird species to the interface for display.
  `,
    `
  To keep the service stable, I added rate limiting and built safeguards into the interface to reduce the chance of rapid or repeated requests overloading the backend. This ensures the model can handle user interaction without degrading performance.
  `,
  ],
  projectPageURI: `/coding/${ukGardenBirdClassifierAppId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.ukGardenBirdClassifierApp}/interface.webp`,
    `${projectImagesFolderPaths.ukGardenBirdClassifierApp}/accuracy.webp`,
    `${projectImagesFolderPaths.ukGardenBirdClassifierApp}/loss.webp`,
  ],
  mainLanguage: ['Python'],
  links: [
    {
      URL: `https://github.com/Jamnic98/${ukGardenBirdClassifierAppId}`,
      label: 'GitHub Repo (FastAPI Server)',
      type: LinkType.EXTERNAL,
    },
    {
      URL: `https://github.com/Jamnic98/${ukGardenBirdClassifierId}`,
      label: 'GitHub Repo (Model Building & Training)',
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: ['Python', 'Pytorch', 'Onnx', 'FastAPI', 'Jinja2'],
}

export default ukGardenBirdClassifierApp
