class GroupModel {
    constructor(idPrimary, organization_id, name, subgroups, user_emails, form_type) {
        this.idPrimary = idPrimary;
        this.organization_id = organization_id;
        this.name = name;
        this.subgroups = subgroups;
        this.user_emails = user_emails;
        this.form_type = form_type;
    }
}

module.exports = GroupModel;
