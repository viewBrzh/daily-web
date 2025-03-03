import { createClient } from '@supabase/supabase-js';

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

class AuthModel {

    // Login method to authenticate using Supabase's built-in authentication
    static async login(email, password) {
        try {
            // Try signing in the user with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,  // Use email for login
                password: password
            });

            // Handle errors if login fails
            if (error) {
                let errorMessage = 'Invalid login credentials';

                // Provide more specific error messages
                if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'The email or password you entered is incorrect.';
                } else if (error.message.includes('No user found')) {
                    errorMessage = 'No user found with this email address.';
                }

                return { success: false, message: errorMessage };
            }

            // Check if user data is available
            if (!data || !data.user) {
                return { success: false, message: 'User data not found' };
            }

            const user = data.user;
            const token = data.session?.access_token;  // Ensure token exists

            // Query the users table for user_id and full_name by email
            const { data: userData, error: userError } = await supabase
                .from('users')  // Assuming 'users' is the table name
                .select('user_id, full_name')  // Select the user_id and full_name
                .eq('email', email)  // Match by email
                .single();  // Get a single record

            if (userError) {
                console.error('Error fetching user details from users table:', userError.message);
                return { success: false, message: 'Error fetching user details from users table' };
            }

            // Return the user data including user_id and full_name from users table
            return {
                success: true,
                token,
                user: {
                    user_id: userData.user_id,  // user_id from the users table
                    email: user.email,  // email used for login
                    full_name: userData.full_name || 'No Name Provided'  // full_name from the users table or default
                }
            };
        } catch (error) {
            console.log('Error during login:', error);
            return { success: false, message: 'An error occurred while processing your login.' };
        }
    }

    static async signUp(email, password, fullName, empId = null) {
        try {
            // Step 1: Create the user in Supabase Auth
            const { user, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName  // Store full name in user metadata
                    }
                }
            });

            if (authError) {
                console.error('Error signing up:', authError.message);
                return { success: false, message: authError.message };
            }

            // Step 2: Insert the user data into the 'users' table in Supabase database
            const { data, error: dbError } = await supabase
                .from('users')
                .insert([
                    {
                        email: email,
                        full_name: fullName,
                        emp_id: empId  // Optionally store emp_id if provided
                    }
                ]);

            if (dbError) {
                console.error('Error inserting user into database:', dbError.message);
                return { success: false, message: dbError.message };
            }

            console.log('User signed up and inserted into database:', data);
            return { success: true, user, data };
        } catch (error) {
            console.error('Error during sign-up:', error);
            return { success: false, message: 'An error occurred while signing you up.' };
        }
    }

    static async logout() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error logging out:', error.message);
                return { success: false, message: error.message };
            }

            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Error during logout:', error);
            return { success: false, message: 'An error occurred while logging you out.' };
        }
    }

    static async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://daily-web-theta.vercel.app/reset-password/update'
            });

            if (error) {
                console.error('Error sending reset password email:', error.message);
                return { success: false, message: error.message };
            }

            return { success: true, message: 'Password reset link has been sent to your email.' };
        } catch (error) {
            console.error('Error during password reset:', error);
            return { success: false, message: 'An error occurred while requesting a password reset.' };
        }
    }

    static async updatePassword(newPassword, token) {
        try {
            const { data, error } = await supabase.auth.api.updateUser(
                token, 
                { password: newPassword }
            );
    
            if (error) {
                console.error('Error updating password:', error.message);
                return { success: false, message: error.message };
            }
    
            return { success: true, message: 'Password updated successfully', data };
        } catch (error) {
            console.error('Error during password update:', error);
            return { success: false, message: 'An error occurred while updating the password.' };
        }
    }    
}

module.exports = AuthModel;
