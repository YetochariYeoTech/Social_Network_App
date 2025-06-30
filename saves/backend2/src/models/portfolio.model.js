import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EducationSchema = new Schema(
  {
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const ExperienceSchema = new Schema(
  {
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    responsibilities: [String],
  },
  { _id: false }
);

const SkillSchema = new Schema(
  {
    name: String,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
  },
  { _id: false }
);

const HobbySchema = new Schema(
  {
    name: String,
    description: String,
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    title: String,
    description: String,
    url: String,
    techStack: [String],
    startDate: Date,
    endDate: Date,
  },
  { _id: false }
);

const PortfolioSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    summary: { type: String, default: "" },
    contact: {
      email: String,
      phone: String,
      website: String,
      linkedIn: String,
      github: String,
    },
    education: { type: [EducationSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    experiences: { type: [ExperienceSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    hobbies: { type: [HobbySchema], default: [] },
  },
  { _id: false }
);

export default model("Portfolio", PortfolioSchema);
