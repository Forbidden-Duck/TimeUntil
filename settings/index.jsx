function SettingsPage(props) {
    return (
        <Page>
            <Section
                title={<Text bold align="center">BIRTHDAY</Text>}>
                <TextInput
                    label="Selected Birthday"
                    title="Select your birthday"
                    settingsKey="birthday"
                    placeholder="yyyy-mm-dd"
                />
            </Section>
            <Section
                title={<Text bold align="center">CUSTOM DATE</Text>}>
                <TextInput
                    label="Selected Title"
                    title="Select your custom title"
                    settingsKey="customTitle"
                    placeholder="i.e. Holiday"
                />
                <TextInput
                    label="Selected Date"
                    title="Select your custom date"
                    settingsKey="customTime"
                    placeholder="yyyy-mm-dd"
                />
            </Section>
        </Page>
    );
}

registerSettingsPage(SettingsPage);