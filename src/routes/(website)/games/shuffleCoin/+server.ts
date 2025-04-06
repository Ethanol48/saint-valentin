
import { AddNewGameGobelet, addPoints, GetLastDayPlayed, GetNumberOfPlay, getPoints, removePoints, SetLastDayPlayed } from '$lib/server/db/utilities';
import { type RequestHandler, fail, json } from '@sveltejs/kit';


function verifyUserCanPlay(userId: string): boolean {
  return true;
}

export const POST: RequestHandler = async ({ request, locals }) => {

  if (locals.user === null) {
    return fail(401, { message: "You need to be authenticated to play" });
  }


  if (!verifyUserCanPlay(locals.user.id)) {
    return fail(401, { message: "You cannot play" });
  }

  let form = await request.formData()
  const cup = form.get('cup')

  if (cup === undefined || cup === null) {
    fail(401, { message: "cup parameter was not given" })
  }

  if (cup !== '1' && cup !== '2' && cup !== '3') {
    fail(401, { message: "cup must be a number from 1 to 3" })
  }

  if (await getPoints(locals.user.id) < 1) {
    return json({
      message: "Vous n'avez pas assez de points pour jouer",
      isWinner: false,
      cup: cup,
      success: false
    })
  }

  const date = new Date();

  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
  const jour = String(date.getDate()).padStart(2, '0');

  const dateFormat = `${annee}${mois}${jour}`;


  if (await GetLastDayPlayed(locals.user.id) === dateFormat) {
    if(await GetNumberOfPlay(locals.user.id) >= 20) {
      return json({
        message: "Vous avez déjà joué 20 fois aujourd'hui",
        isWinner: false,
        cup: cup,
        success: false
      })
    }
    else{
      await AddNewGameGobelet(locals.user.id);
    }
  }
  else{
    await SetLastDayPlayed(locals.user.id, dateFormat);
  }


  await removePoints(locals.user.id, 1);
  const random =  Math.random();

  const isWinner =random < 0.33;

  if (isWinner) {
    await addPoints(locals.user.id, 4)
  }
  

  const mensaje = isWinner
    ? `Well done!You have found the gold coin!🪙`
    : "Too bad, try again with another cup. 😢";


  return json({
    message: mensaje,
    isWinner: isWinner,
    cup: cup,
    success: true
  })
}

