import { Platform, CampaignObjective, Model, Tone, CTA } from '../../backend';

interface ContentParams {
  platform: Platform;
  objective: CampaignObjective;
  model: Model;
  tone: Tone;
  cta: CTA;
  price: number;
  discount: number;
  mileage: number;
}

export function generateContentPackage(params: ContentParams) {
  const { platform, objective, model, tone, cta, price, discount, mileage } = params;

  const modelNames: Record<Model, string> = {
    [Model.f150]: 'Ford F-150',
    [Model.mustang]: 'Ford Mustang',
    [Model.explorer]: 'Ford Explorer',
  };

  const modelName = modelNames[model];
  const finalPrice = price - discount;
  const isNew = mileage === 0;

  let caption = '';
  let hashtags: string[] = [];
  let shotList: string[] = [];
  let postingChecklist: string[] = [];

  // Generate caption based on tone and objective
  if (tone === Tone.excited) {
    caption = `🚗 AMAZING DEAL ALERT! 🚗\n\n`;
    caption += `Get behind the wheel of a ${isNew ? 'brand new' : 'certified pre-owned'} ${modelName}!\n\n`;
    if (discount > 0) {
      caption += `💰 Save $${discount.toLocaleString()} - Now only $${finalPrice.toLocaleString()}!\n`;
    } else {
      caption += `💰 Starting at $${price.toLocaleString()}!\n`;
    }
    caption += `\n✨ Don't miss out on this incredible opportunity!\n`;
  } else if (tone === Tone.trustedAdvisor) {
    caption = `Looking for a reliable ${modelName}?\n\n`;
    caption += `We understand that choosing the right vehicle is an important decision. `;
    caption += `Our team is here to help you find the perfect ${modelName} that fits your lifestyle and budget.\n\n`;
    if (discount > 0) {
      caption += `Special offer: Save $${discount.toLocaleString()} on select models.\n`;
    }
    caption += `\nLet's find your perfect match together.`;
  } else {
    caption = `Your neighbors trust us, and so can you! 🏘️\n\n`;
    caption += `Proud to serve our community with quality vehicles like the ${modelName}.\n\n`;
    if (discount > 0) {
      caption += `Community special: $${discount.toLocaleString()} off - Now $${finalPrice.toLocaleString()}!\n`;
    }
    caption += `\nFamily-owned, community-focused. That's our promise.`;
  }

  // Add CTA
  if (cta === CTA.scheduleTestDrive) {
    caption += `\n\n📅 Schedule your test drive today!`;
  } else if (cta === CTA.visitDealership) {
    caption += `\n\n🏢 Visit our dealership today!`;
  } else {
    caption += `\n\n💬 Get your personalized quote now!`;
  }

  // Generate hashtags based on platform and model
  const baseHashtags = ['#Ford', `#${model.toUpperCase()}`, '#CarDealer', '#NewCar'];
  const platformHashtags: Record<Platform, string[]> = {
    [Platform.facebook]: ['#LocalBusiness', '#CommunityFirst', '#FamilyOwned'],
    [Platform.instagram]: ['#InstaAuto', '#CarGram', '#DreamCar', '#AutoLife'],
    [Platform.tiktok]: ['#CarTok', '#FordTok', '#CarDeals', '#AutoTok'],
  };

  hashtags = [...baseHashtags, ...platformHashtags[platform]];

  if (objective === CampaignObjective.testDrive) {
    hashtags.push('#TestDrive', '#TryBeforeYouBuy');
  } else if (objective === CampaignObjective.leadGeneration) {
    hashtags.push('#SpecialOffer', '#LimitedTime');
  }

  // Generate shot list
  shotList = [
    `Exterior 360° view of the ${modelName} in natural lighting`,
    `Close-up of signature Ford grille and headlights`,
    `Interior dashboard and infotainment system showcase`,
    `Driver's seat perspective showing comfort and space`,
    `Trunk/cargo space demonstration`,
  ];

  if (model === Model.f150) {
    shotList.push(`Towing capacity demonstration or bed utility shot`);
  } else if (model === Model.mustang) {
    shotList.push(`Performance shot - acceleration or handling`);
  } else {
    shotList.push(`Family-friendly features and seating configuration`);
  }

  // Generate posting checklist
  postingChecklist = [
    `Review caption for accuracy and tone`,
    `Verify pricing and offer details`,
    `Check all hashtags are relevant and spelled correctly`,
    `Ensure images/videos are high quality and properly formatted`,
    `Tag dealership location and Ford official accounts`,
    `Set up tracking parameters for lead attribution`,
    `Schedule post for optimal engagement time`,
    `Prepare to respond to comments within 1 hour`,
  ];

  if (platform === Platform.instagram) {
    postingChecklist.push(`Add location tag and story highlight`);
  } else if (platform === Platform.tiktok) {
    postingChecklist.push(`Add trending audio and effects`);
  }

  return {
    caption,
    hashtags,
    shotList,
    postingChecklist,
  };
}
