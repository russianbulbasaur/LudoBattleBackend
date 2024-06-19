class Pool{
    ob;
    getInstance(){
        if(this.ob==null){
            this.ob = new Pool();
            return this.ob;
        }
        return this.ob;
    }
}