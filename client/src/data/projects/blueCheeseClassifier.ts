import { LinkType, type Project } from 'types'
import { projectImagesFolderPaths } from 'utils/constants'

const projectId = 'blue-cheese-classifier'

const blueCheeseClassifier: Project = {
  id: projectId,
  title: 'Blue Cheese Classifier',
  summary: 'A binary image classifier for identifying blue cheese.',
  paragraphs: [
    `For the intermediate machine learning course I enrolled in back in 2020, we were given the option of creating one of three projects related to ML as our final assignment.
    The options were to create a model to handle big data, image classification, or time series. I chose to make an image classifier as the subject appealed to me the most.`,

    `My goal was to see if I could train a model to distinguish between blue cheese and regular cheese, as well as recognise the characteristics of blue cheese and correctly identify cheese that was mouldy as a result of going bad as not blue cheese, since only blue cheese is intentionally made to be mouldly.`,
    `The first step was to gather a large dataset of images. To do this, I built a web scraper with Beautifulsoup and the requests library to pull images from Google. I scraped for a variety cheeses, including blue cheeses, regular cheeses, mouldy cheeses and cheeses with other objects in them such as fruits and nuts.
     This would provide the model with a diverse dataset to learn from. I ended up with around 4000 images, which I then split into training and testing sets. The training set contained 80% of the images, while the testing set contained the remaining 20%. Lastly, I split the test set to make a validation set for testing the accuracy of different models.
     I made sure to balance the dataset so that each class had an equal number of images. This was important to ensure that the model would not be biased towards one class over another.`,

    `Once I had collected the dataset, my next task was to preprocess the images. This involved resizing the images to a consistent size, normalising the pixel values, and augmenting the dataset to increase its size and diversity.
     I used the ImageDataGenerator class from Keras to perform these tasks. The augmentation included random rotations, shifts, flips, and zooms to create variations of the original images. This helped to improve the model's robustness and generalisation ability.`,

    `After processing the dataset, I used Keras to build a convolutional neural network (CNN) and trained it on the images. I used a sequential model with several convolutional layers, followed by max pooling layers and dropout layers to prevent overfitting.
     The final layer was a dense layer with a sigmoid activation function for binary classification. I used the categorical crossentropy loss function and the Adam optimiser for training.`,

    `The first model worked well and had an accuracy score of 87%. As a large portion of the images had other objects in them such as people and fruits, I decided to crop around the cheese so that the image was focused on the cheese, hoping that would increase the accuracy.`,
    `With over 4000 images, cropping each image manually would have been rather tedious, so I employed the help of a previously trained image classifier, which had (among other things) been trained on images of cheese!
     I used the pre-trained model in a Python script to identify the cheese in each image and generate a bounding box for the cheese in the image. The script then cropped around the cheese and saved the modified image.
     I then passed these cropped images through the pipeline I had created to resize, normalise and augment the images. With the updated image set, I trained the model again, which resulted in a 6% increase in the accuracy score.`,
  ],
  projectPageURI: `/coding/${projectId}`,
  screenshotURIs: [
    `${projectImagesFolderPaths.blueCheeseClassifier}/image_classification.webp`,
    `${projectImagesFolderPaths.blueCheeseClassifier}/results_graph.webp`,
  ],
  mainLanguage: ['Python'],
  links: [
    {
      label: 'GitHub Repo',
      URL: `https://github.com/Jamnic98/${projectId}`,
      type: LinkType.EXTERNAL,
    },
  ],
  techStack: [
    'Python',
    'Keras',
    'TensorFlow',
    'OpenCV',
    'Matplotlib',
    'NumPy',
    'Scikit-learn',
    'BeautifiulSoup',
  ],
  readmePath: `https://raw.githubusercontent.com/Jamnic98/${projectId}/refs/heads/main/README.md`,
}

export default blueCheeseClassifier
