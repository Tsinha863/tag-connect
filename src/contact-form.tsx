async onSubmit(event) {
    event.preventDefault();
    try {
        const docRef = await addDoc(collection(db, 'contacts'), {
            // Assuming you are collecting these from your form
            name: this.state.name,
            email: this.state.email,
            message: this.state.message,
        });
        console.log('Document written with ID: ', docRef.id);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}