import useAddTags from './useAddTags';
import useRemoveTags from './useRemoveTags';

const updatePresenceTags = async (
  tags: { id: string; idChallengeTag: string; status: 'add' | 'remove' }[],
  challengeId: string,
) => {
  for (const tag of tags) {
    if (tag.status === 'add') {
      useAddTags(tag, challengeId);
    } else {
      useRemoveTags(tag.idChallengeTag);
    }
  }
};

export default updatePresenceTags;
