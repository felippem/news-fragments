const Joi = require("@hapi/joi");

const fragmentsTypesSchema = Joi.object({
  title: Joi.string().required(),
  extension: Joi.string().required()
}).required();

const schema = Joi.object({
  changelogFile: Joi.string().required(),
  changelogDateFormat: Joi.string().required(),
  changelogTemplate: Joi.string().required(),
  fragmentsFolder: Joi.string().required(),
  fragmentsTypes: Joi.array()
    .items(fragmentsTypesSchema)
    .required()
});

const changelogTemplate = `# [newVersion] - (bumpDate)
{{#each fragments}}
## {fragment.title}
  {{#each fragmentEntries}}
    * {fragment}
  {{/each}}
{{/each}}
`;

const baseConfig = {
  changelogFile: "CHANGELOG.md",
  changelogDateFormat: "YYYY-MM-DD",
  changelogTemplate: changelogTemplate,
  fragmentsFolder: "fragments",
  fragmentsTypes: [
    { title: "Features", extension: "feature" },
    { title: "Bugfixes", extension: "bugfix" },
    { title: "Documentation", extension: "doc" },
    { title: "Deprecations and Removals", extension: "removal" },
    { title: "Misc", extension: "misc" }
  ]
};

module.exports.buildConfig = function(config) {
  newsFragmentConfiguration = Object.assign({}, baseConfig, config);

  const { error } = schema.validate(newsFragmentConfiguration);

  if (error) {
    throw new Error(error.message);
  }

  return newsFragmentConfiguration;
};