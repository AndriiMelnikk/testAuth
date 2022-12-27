import Router from 'express';

import getChallenges from './methods/template/getChallenges';
import getChallenge from './methods/template/getChallenge';
import createChallenges from './methods/template/createChallenge';
import updateChallenge from './methods/template/putChallenge';

import getChallengesActive from './methods/active/getChallenges';
import getChallengeActive from './methods/active/getChallenge';
import updateChallengeActive from './methods/active/updateChallenge';
import createChallengeActive from './methods/active/createChallenge';

// import addChallengeActive from './methods/active/addChallengeActive';
import restoreChallengeActive from './methods/active/restoreChallenge';

const RouterChallenges = new (Router as any)();

RouterChallenges.get('/templates', getChallenges);

RouterChallenges.get('/template', getChallenge);
RouterChallenges.post('/template', createChallenges);
RouterChallenges.put('/template', updateChallenge);

RouterChallenges.get('/actives', getChallengesActive);

RouterChallenges.get('/active', getChallengeActive);
RouterChallenges.post('/active', createChallengeActive);
RouterChallenges.put('/active', updateChallengeActive);

RouterChallenges.put('/active/restore', restoreChallengeActive);
// RouterChallenges.post('/active/add', addChallengeActive);

export default RouterChallenges;
