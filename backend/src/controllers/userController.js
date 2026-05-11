import {
  findUserById,
  updateUserProfile,
} from "../repository/userRepository.js";

function publicUserShape(user) {
  const profile = user.profile || {};
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile,
  };
}

export const getMe = async (req, res) => {
  try {
    return res.status(200).json(publicUserShape(req.user));
  } catch (error) {
    console.error("getMe error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // nhận toàn bộ json gửi lên
    const profileData = req.body;

    // validate cơ bản
    if (
      !profileData ||
      typeof profileData !== "object" ||
      Array.isArray(profileData)
    ) {
      return res.status(400).json({
        message: "Profile data phải là JSON object",
      });
    }

    const updatedProfile = await updateUserProfile(req.user.id, profileData);

    const user = await findUserById(req.user.id, {
      attributes: { exclude: ["hashedPassword"] },
    });

    return res.status(200).json({
      message: "Cập nhật profile thành công",
      user: publicUserShape(user),
    });
  } catch (error) {
    console.error("updateProfile error", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
