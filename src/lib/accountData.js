function normalizeFiche(fiche) {
  return {
    fiche_path: fiche?.fiche_path || fiche?.path || '',
    fiche_title: fiche?.fiche_title || fiche?.title || '',
    fiche_type: fiche?.fiche_type || fiche?.type || 'fiche',
  };
}

export async function getUserFavorites(supabase, userId) {
  if (!supabase || !userId) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id, fiche_path, fiche_title, fiche_type, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

export async function isFavorite(supabase, userId, fichePath) {
  if (!supabase || !userId || !fichePath) {
    return { data: false, error: null };
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('fiche_path', fichePath)
    .maybeSingle();

  return { data: !!data, error };
}

export async function addFavorite(supabase, userId, fiche) {
  if (!supabase || !userId) {
    return { error: new Error('Utilisateur non connecté.') };
  }

  const normalized = normalizeFiche(fiche);

  if (!normalized.fiche_path || !normalized.fiche_title) {
    return { error: new Error('Fiche invalide.') };
  }

  const { error } = await supabase
    .from('user_favorites')
    .upsert(
      {
        user_id: userId,
        fiche_path: normalized.fiche_path,
        fiche_title: normalized.fiche_title,
        fiche_type: normalized.fiche_type,
      },
      {
        onConflict: 'user_id,fiche_path',
      }
    );

  return { error: error || null };
}

export async function removeFavorite(supabase, userId, fichePath) {
  if (!supabase || !userId || !fichePath) {
    return { error: null };
  }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('fiche_path', fichePath);

  return { error: error || null };
}

export async function toggleFavorite(supabase, userId, fiche) {
  const normalized = normalizeFiche(fiche);

  const { data: alreadyFavorite, error: checkError } = await isFavorite(
    supabase,
    userId,
    normalized.fiche_path
  );

  if (checkError) {
    return { isFavorite: false, error: checkError };
  }

  if (alreadyFavorite) {
    const { error } = await removeFavorite(
      supabase,
      userId,
      normalized.fiche_path
    );

    return { isFavorite: false, error: error || null };
  }

  const { error } = await addFavorite(supabase, userId, normalized);

  return { isFavorite: true, error: error || null };
}

export async function getUserHistory(supabase, userId) {
  if (!supabase || !userId) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('user_history')
    .select('id, fiche_path, fiche_title, fiche_type, last_viewed_at')
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false })
    .limit(10);

  return { data: data || [], error };
}

export async function recordHistoryView(supabase, userId, fiche) {
  if (!supabase || !userId) {
    return { error: null };
  }

  const normalized = normalizeFiche(fiche);

  if (!normalized.fiche_path || !normalized.fiche_title) {
    return { error: new Error('Fiche invalide.') };
  }

  const now = new Date().toISOString();

  const { error: upsertError } = await supabase
    .from('user_history')
    .upsert(
      {
        user_id: userId,
        fiche_path: normalized.fiche_path,
        fiche_title: normalized.fiche_title,
        fiche_type: normalized.fiche_type,
        last_viewed_at: now,
      },
      {
        onConflict: 'user_id,fiche_path',
      }
    );

  if (upsertError) {
    return { error: upsertError };
  }

  const { data: rows, error: overflowError } = await supabase
    .from('user_history')
    .select('id')
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false })
    .range(10, 999);

  if (overflowError) {
    return { error: overflowError };
  }

  const idsToDelete = (rows || []).map((row) => row.id);

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('user_history')
      .delete()
      .eq('user_id', userId)
      .in('id', idsToDelete);

    if (deleteError) {
      return { error: deleteError };
    }
  }

  return { error: null };
}