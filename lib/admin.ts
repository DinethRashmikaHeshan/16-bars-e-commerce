// Admin whitelist - Add email addresses here to make them admins
// In production, you'd manage this in your database/Supabase
export const ADMIN_WHITELIST = [
  // Add admin emails here
  // 'admin@16bars.com',
  'dineth550@gmail.com'
];

export async function isAdminEmail(email: string): Promise<boolean> {
  return ADMIN_WHITELIST.includes(email.toLowerCase());
}

export async function createOrUpdateAdminRole(
  supabase: any,
  userId: string,
  email: string
): Promise<void> {
  const isAdmin = await isAdminEmail(email);

  // Check if user_roles entry exists
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existingRole) {
    // Update existing
    await supabase
      .from('user_roles')
      .update({ is_admin: isAdmin })
      .eq('user_id', userId);
  } else {
    // Create new
    await supabase.from('user_roles').insert({
      user_id: userId,
      is_admin: isAdmin,
    });
  }
}
