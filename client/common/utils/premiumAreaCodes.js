import includes from 'lodash/includes';

export const premiumAreaCodes = {
    localUS: ['202', '212', '214', '281', '310', '410', '617', '713', '718', '917'],
    localCanada: ['416', '905'],
    tollFree: ['800']
};

export const isAreaCodePremium = (areaCode) => {
    if (!(typeof areaCode === 'string' && areaCode.length === 3)) {
        throw Error('Area code must be a 3 character long string');
    }

    const { localUS, localCanada, tollFree } = premiumAreaCodes;
    const premiumCodesList = [...localUS, ...localCanada, ...tollFree];

    return includes(premiumCodesList, areaCode);
};
