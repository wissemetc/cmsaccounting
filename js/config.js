/**
 * Configuration des endpoints API
 *
 * INSTRUCTIONS :
 * 1. Pour Netlify (par défaut) : laisser les URLs comme ci-dessous
 * 2. Pour AWS Lambda : après déploiement, remplacer par vos URLs API Gateway
 *    Format : https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod
 */

const API_CONFIG = {
  // Décommentez et configurez pour AWS Lambda
   GET_AVAILABILITY_URL: 'https://dsmnajivu2.execute-api.eu-west-1.amazonaws.com/prod/get-availability',
   CREATE_BOOKING_URL: 'https://dsmnajivu2.execute-api.eu-west-1.amazonaws.com/prod/create-booking',

  // Par défaut : Netlify Functions (commentez ces lignes si vous utilisez AWS)
  //GET_AVAILABILITY_URL: '/.netlify/functions/get-availability',
  //CREATE_BOOKING_URL: '/.netlify/functions/create-booking',
};
