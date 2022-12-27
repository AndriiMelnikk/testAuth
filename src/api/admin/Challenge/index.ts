import Router from 'express';

import getChallenges from './methods/getChallenges';
import putChallenges from './methods/putChallenge';
import createChallenges from './methods/createChallenge';

import getChallengesActive from './methods/active/getChallengesActive';
import addChallengeActive from './methods/active/addChallengeActive';
import removeWaitChallenge from './methods/active/removeWaitChallenge';

const RouterChallenges = new (Router as any)();

RouterChallenges.get('/', getChallenges);
RouterChallenges.post('/', createChallenges);
RouterChallenges.put('/', putChallenges);

RouterChallenges.get('/active', getChallengesActive);
RouterChallenges.post('/active', addChallengeActive);
RouterChallenges.delete('/active', removeWaitChallenge);

export default RouterChallenges;
